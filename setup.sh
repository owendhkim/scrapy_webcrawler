#!/usr/bin/env bash

# Install/update Java
echo "Install/updating Java"
sudo dnf install java-11-openjdk-devel

# Define the file to update
bash_profile="${HOME}/.bash_profile"

# Exporting JAVA_HOME
java_home_cmd='export JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")'

if grep -q 'export JAVA_HOME' "$bash_profile"; then
    echo "JAVA_HOME is already set in $bash_profile."
else
    # If JAVA_HOME is not set, add it
    echo "$java_home_cmd" >> "$bash_profile"
    echo "JAVA_HOME added to $bash_profile."
fi

work_dir="search-dev"

mkdir -p "./$work_dir"

cd "./$work_dir"

# URLs of the tarballs
solr_tarball="https://archive.apache.org/dist/solr/solr/9.6.0/solr-9.6.0.tgz"
nutch_tarball="https://archive.apache.org/dist/nutch/1.20/apache-nutch-1.20-bin.tar.gz"

# Download the tarballs
curl -o "solr.tar.gz" "$solr_tarball"
curl -o "nutch.tar.gz" "$nutch_tarball"

# Check if the downloads were successful
if [[ ! -f "solr.tar.gz" ]]; then
    echo "Solr download failed.."
    exit 1
fi

if [[ ! -f "nutch.tar.gz" ]]; then
    echo "Nutch download failed.."
    exit 1
fi

# Extract the tarballs
echo "Extracting tarballs"
tar -xzf "solr.tar.gz"
tar -xzf "nutch.tar.gz"

# Remove the tarballs after extracting
echo "Removing tarballs"
rm solr.tar.gz
rm nutch.tar.gz

# Exporting SOLR_HOME and  NUTCH_HOME
java_home_cmd='export JAVA_HOME=${HOME}/'

if grep -q 'export SOLR_HOME' "$bash_profile"; then
    echo "SOLR_HOME is already set in $bash_profile."
else
    # If SOLR_HOME is not set, add it
    echo "$java_home_cmd" >> "$bash_profile"
    echo "SOLR_HOME added to $bash_profile."
fi

echo "Solr and nutch downloaded and extracted successfully."

