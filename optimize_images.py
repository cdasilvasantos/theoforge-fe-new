import argparse
from pathlib import Path
from PIL import Image, UnidentifiedImageError
import os
import tempfile
import shutil

def optimize_image(image_path, max_width=1920, max_height=1080, quality=85):
    """Optimizes a single image in-place: resizes and compresses."""
    try:
        img = Image.open(image_path)
        original_size = os.path.getsize(image_path)
        img_format = img.format # Store original format (JPEG, PNG, WEBP etc.)

        print(f"Processing {image_path.name} ({img_format}, {original_size/1024:.1f}KB)...", end=' ')

        # --- Resize if necessary ---
        width, height = img.size
        needs_optimizing = False
        if width > max_width or height > max_height:
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            print(f"Resized to {img.size}.", end=' ')
            needs_optimizing = True

        # --- Prepare save options ---
        save_options = {}
        if img_format in ['JPEG', 'JPG']:
            save_options['quality'] = quality
            save_options['optimize'] = True
            save_options['progressive'] = True
            # Handle RGBA PNGs potentially being opened and needing conversion for JPEG save
            if img.mode == 'RGBA':
                 print(f"Converting RGBA to RGB for JPEG.", end=' ')
                 img = img.convert('RGB')
            needs_optimizing = True # Always re-save JPEGs to apply quality/optimize settings
        elif img_format == 'PNG':
             save_options['optimize'] = True
             needs_optimizing = True # Always re-save PNGs to apply optimize settings
        elif img_format == 'WEBP':
             save_options['quality'] = quality
             needs_optimizing = True # Always re-save WEBPs to apply quality settings

        # --- Save the optimized image to a temp file, then replace original ---
        if needs_optimizing:
            # Create a temporary file in the same directory to avoid cross-device move issues
            temp_dir = image_path.parent
            temp_fd, temp_path_str = tempfile.mkstemp(suffix=image_path.suffix, dir=temp_dir)
            os.close(temp_fd) # Close the file descriptor
            temp_path = Path(temp_path_str)

            try:
                img.save(temp_path, format=img_format, **save_options)
                optimized_size = os.path.getsize(temp_path)
                reduction = original_size - optimized_size
                percent_reduction = (reduction / original_size) * 100 if original_size > 0 else 0

                # Replace the original file with the optimized one
                shutil.move(temp_path, image_path)

                print(f"Saved: {optimized_size/1024:.1f}KB ({percent_reduction:.1f}% reduction)")
            except Exception as save_error:
                 print(f"Error during save/replace for {image_path.name}: {save_error}")
                 # Clean up the temp file if it still exists
                 if temp_path.exists():
                     os.remove(temp_path)
                 return False
            finally:
                 # Ensure temp file is removed if move failed but file exists
                 if temp_path.exists():
                     try:
                          os.remove(temp_path)
                     except OSError:
                          pass # Ignore error if move was successful
        else:
             print("Skipped: No resizing or optimization needed.")

        return True

    except UnidentifiedImageError:
        print(f"Skipped: Cannot identify image file {image_path.name}.")
        return False
    except Exception as e:
        print(f"Error optimizing {image_path.name}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Optimize images IN-PLACE for the web (resizing and compression). Overwrites originals!")
    parser.add_argument("input_dir", type=str, help="Directory containing images to optimize.")
    parser.add_argument("--max-width", type=int, default=1920, help="Maximum width for images (default: 1920).")
    parser.add_argument("--max-height", type=int, default=1080, help="Maximum height for images (default: 1080).")
    parser.add_argument("--quality", type=int, default=80, help="Quality setting for JPEG/WEBP (0-100, default: 80).")
    parser.add_argument("--recursive", action='store_true', help="Search for images recursively.")

    args = parser.parse_args()

    input_path = Path(args.input_dir)

    if not input_path.is_dir():
        print(f"Error: Input directory '{args.input_dir}' not found or is not a directory.")
        return

    image_extensions = ['.png', '.jpg', '.jpeg', '.webp']

    print("Starting IN-PLACE image optimization...")
    print("!!! WARNING: This will OVERWRITE original files. Make sure you have a backup! !!!")
    print(f"Input directory: {input_path.resolve()}")
    print(f"Max dimensions: {args.max_width}x{args.max_height}")
    print(f"JPEG/WEBP Quality: {args.quality}")
    print(f"Recursive search: {args.recursive}")
    print("---")

    images_processed = 0
    images_failed = 0

    glob_method = input_path.rglob if args.recursive else input_path.glob
    found_images = False

    for item in glob_method('*'): 
        if item.is_file() and item.suffix.lower() in image_extensions:
            found_images = True

            if optimize_image(item, args.max_width, args.max_height, args.quality):
                 images_processed += 1
            else:
                 images_failed += 1

    print("\n---")
    if not found_images:
        print("No images found in the input directory matching the specified criteria.")
    else:
        print(f"In-place optimization complete.")
        print(f"Images Attempted: {images_processed + images_failed}")
        print(f"Images Successfully Optimized: {images_processed}")
        print(f"Images Failed: {images_failed}")

if __name__ == "__main__":
    main()
