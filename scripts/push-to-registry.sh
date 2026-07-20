# push-to-registry.sh
# This script is used to push the compiled files to the registry. Intended for use in Github Actions.

#!/usr/bin/env bash
set -euo pipefail

BASE_URL="https://registry-api.mnmzc.us.to/r/7/api/v1/files/"
DIST_DIR="dist"

find "$DIST_DIR" -type f | while read -r file; do
    rel_path="${file#$DIST_DIR/}"
    echo "Pushing $rel_path to registry..."
    curl --location --request \
        PUT "https://registry-api.mnmzc.us.to/r/7/api/v1/files/frontend/${rel_path}" \
        --header "x-api-key: $REGISTRY_API_KEY" \
        --form "file=@\"$file\""
done