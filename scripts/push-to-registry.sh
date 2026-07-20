# push-to-registry.sh
# This script is used to push the compiled files to the registry. Intended for use in Github Actions.

#!/usr/bin/env bash
set -euo pipefail

BASE_URL="https://registry-api.mnmzc.us.to/r/7/api/v1/files/"
DIST_DIR="dist"

find "$DIST_DIR" -type f | while read -r file; do
    rel_path="${file#$DIST_DIR/}"
    echo "Pushing $rel_path to registry..."
    curl -sf -X PUT \
        -H "X-API-Key: $REGISTRY_API_KEY" \
        --data-binary @"$file" \
        "$BASE_URL$rel_path"
done