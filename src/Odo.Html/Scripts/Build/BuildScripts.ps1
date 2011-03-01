param([string]$dir = $(split-path $(gv MyInvocation).Value.InvocationName))

write-host $("Building scripts from: " + $dir)

# include.txt contains all of the scripts to be included in the final script
$includeContent = get-content $(join-path $dir include.txt) | foreach-object { join-path $dir $_ }

# paths to the outputs
$scriptPath = join-path $dir ../odo.html.js
$minScriptPath = join-path $dir ../odo.html.min.js

# path to the scratch folder
$tempPath = join-path $dir temp

# path to the generated resources file
$genResourcesPath = join-path $tempPath generatedResources.js

# path to the folder containing the source resources
$resourceSourcePath = join-path $dir ../resources

# build resources from each file in the resources folder
if (!(test-path $tempPath)) {
	new-item $tempPath -type directory | out-null
}
get-childitem $resourceSourcePath/* | where-object {!($_.psiscontainer)} | foreach-object { `
	"_resources['" + $_.name.Replace(".", "_") + "'] = " + $(get-content $_ | foreach-object { [string]::Format("'{0}\n' +`n", $_.Replace("\", "\\").Replace("'", "\'")) }) + "'';`n" } `
	| out-file -Encoding UTF8 $genResourcesPath

# concat input files (in appropriate order) into the final odo.html.js file
get-content $includeContent | out-file -Encoding UTF8 $scriptPath

# TODO: minify (for now, just copy)
get-content $scriptPath | out-file -Encoding UTF8 $minScriptPath

