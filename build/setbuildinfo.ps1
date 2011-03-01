param([string]$version, [string]$dir = $(split-path $(gv MyInvocation).Value.InvocationName))

"using System.Reflection; [assembly: AssemblyVersion(`"$version`"), assembly: AssemblyFileVersion(`"$version`")]" | out-file "$dir/../src/common/SolutionInfo.cs"