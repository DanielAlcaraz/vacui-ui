const fs = require('fs');
const path = require('path');

// Paths for the output directory and the JSON files
const outputDirectory = path.resolve(__dirname, '../output');
const gzipOutputPath = path.join(outputDirectory, 'output-gzip.json');
const nonGzipOutputPath = path.join(outputDirectory, 'output-nongzip.json');

// Ensure the output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

// Read the gzip and non-gzip outputs
const gzipData = JSON.parse(fs.readFileSync(gzipOutputPath, 'utf8'));
const nonGzipData = JSON.parse(fs.readFileSync(nonGzipOutputPath, 'utf8'));

// Function to extract the package name from the bundle name
function extractPackageName(bundleName) {
  const match = /esm2022\/([^\/]+)\//.exec(bundleName);
  return match ? match[1] : null;
}

// Function to aggregate data from both files
function aggregateData(sourceData, isGzip) {
  const aggregatedData = {};

  sourceData.results.forEach(bundle => {
    const packageName = extractPackageName(bundle.bundleName);
    if (!packageName) return;

    if (!aggregatedData[packageName]) {
      aggregatedData[packageName] = {
        totalBytes: 0,
        totalKb: 0,
        gzipBytes: 0,
        gzipKb: 0
      };
    }

    if (isGzip) {
      aggregatedData[packageName].gzipBytes += bundle.totalBytes;
      aggregatedData[packageName].gzipKb += bundle.totalBytes / 1024;
    } else {
      aggregatedData[packageName].totalBytes += bundle.totalBytes;
      aggregatedData[packageName].totalKb += bundle.totalBytes / 1024;
    }
  });

  return aggregatedData;
}

// Aggregate data for both gzip and non-gzip
const aggregatedGzip = aggregateData(gzipData, true);
const aggregatedNonGzip = aggregateData(nonGzipData, false);

// Merge the aggregated data from both sources
const finalData = { ...aggregatedNonGzip };
for (const [key, value] of Object.entries(aggregatedGzip)) {
  if (finalData[key]) {
    finalData[key].gzipBytes = value.gzipBytes;
    finalData[key].gzipKb = parseFloat((value.gzipBytes / 1024).toFixed(2));
  } else {
    finalData[key] = {
      totalBytes: 0,
      totalKb: 0,
      gzipBytes: value.gzipBytes,
      gzipKb: parseFloat((value.gzipBytes / 1024).toFixed(2))
    };
  }
}

// Round kilobytes to two decimal places
const roundKbValues = obj => {
  Object.keys(obj).forEach(packageName => {
    obj[packageName].totalKb = parseFloat(obj[packageName].totalKb.toFixed(2));
    obj[packageName].gzipKb = parseFloat(obj[packageName].gzipKb.toFixed(2));
  });
};

roundKbValues(finalData);

// Save the merged and rounded data to a new JSON file in the output folder
const finalOutputPath = path.join(outputDirectory, 'primitives-bundle-stats.json');
fs.writeFileSync(finalOutputPath, JSON.stringify(finalData, null, 2), 'utf8');
console.log(`Data aggregated and saved to ${finalOutputPath} with essential bytes and kilobytes.`);
