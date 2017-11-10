find . -type f -name '*.png' -print0 |
  while IFS= read -r -d '' file
    do optipng "${file}"
  done
