import zipfile
import os
import sys

def create_liferay_zip(source_dir, output_filename):
    """
    Creates a Liferay-compatible ZIP by ensuring only relevant files 
    (collection.json, fragments/) are included and the root directory 
    is correctly structured.
    """
    source_dir = os.path.abspath(source_dir)
    root_dirname = os.path.basename(source_dir)
    
    # Allowed top-level entries in the collection folder
    allowed_entries = ['collection.json', 'fragments', 'resources']
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Calculate relative path from source_dir
            rel_root = os.path.relpath(root, source_dir)
            
            # Check if this directory or its parent is allowed
            if rel_root == '.':
                # Root of the source_dir
                current_files = [f for f in files if f in allowed_entries]
                current_dirs = [d for d in dirs if d in allowed_entries]
            else:
                first_part = rel_root.split(os.sep)[0]
                if first_part not in allowed_entries:
                    continue
                current_files = files
                current_dirs = dirs

            for file in current_files:
                full_path = os.path.join(root, file)
                # Path inside ZIP starts with root_dirname
                zip_path = os.path.join(root_dirname, rel_root, file)
                # Normalize path for ZIP (always forward slashes and remove redundancies)
                zip_path = os.path.normpath(zip_path).replace(os.sep, '/')
                
                zipf.write(full_path, zip_path)
                print(f"Added: {zip_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_zip.py <source_dir> <output_zip_name>")
        sys.exit(1)
        
    src = sys.argv[1]
    out = sys.argv[2]
    
    if not os.path.isdir(src):
        print(f"Error: {src} is not a directory.")
        sys.exit(1)
        
    create_liferay_zip(src, out)
    print(f"\nSuccessfully created Liferay-compatible ZIP: {out}")
