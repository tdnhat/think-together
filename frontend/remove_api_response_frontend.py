#!/usr/bin/env python3
"""
Script to remove ApiResponse unwrapping from frontend service files.
"""
import re
import sys
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Step 1: Remove ApiResponse from type annotations
    content = re.sub(
        r'api\.(get|post|put|patch|delete)<ApiResponse<([^>]+)>>',
        r'api.\1<\2>',
        content
    )
    
    # Step 2: Remove response.success && response.data checks and return response.data
    # Pattern: if (response.success && response.data) { return response.data; }
    content = re.sub(
        r'if\s*\(\s*response\.success\s*&&\s*response\.data\s*\)\s*\{\s*return\s*response\.data;\s*\}',
        r'return response;',
        content,
        flags=re.DOTALL
    )
    
    # Step 3: Remove throw new Error(response.message || ...) after failed checks
    content = re.sub(
        r'throw\s+new\s+Error\(response\.message\s*\|\|\s*[^)]+\);',
        r'// Response handled by error interceptor',
        content
    )
    
    # Step 4: Remove ApiResponse import if present
    content = re.sub(
        r'import\s+type\s+\{[^}]*ApiResponse[^}]*\}\s+from\s+[\'"][^\'"]+[\'"];?\n?',
        lambda m: m.group(0).replace('ApiResponse,', '').replace(', ApiResponse', '').replace('ApiResponse', '') if 'ApiResponse' in m.group(0) else m.group(0),
        content
    )
    
    # Clean up empty imports
    content = re.sub(r'import\s+type\s+\{\s*\}\s+from\s+[\'"][^\'"]+[\'"];?\n', '', content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

if __name__ == '__main__':
    patterns = sys.argv[1:] if len(sys.argv) > 1 else ['src/lib/api/services/**/*.ts', 'src/features/**/api/*.ts']
    
    modified = []
    for pattern in patterns:
        for filepath in glob.glob(pattern, recursive=True):
            if process_file(filepath):
                modified.append(filepath)
    
    if modified:
        print(f"Modified {len(modified)} files:")
        for f in modified:
            print(f"  - {f}")
    else:
        print("No files modified")
