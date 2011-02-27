param([string]$dir = $(split-path $(gv MyInvocation).Value.InvocationName))

$src = join-path $dir example.web/bin
$dest = join-path $dir ../dss-frontend/lib/odo

write-host Distributing Odo from $src to $dest

cp $(join-path $src odo.core.dll) $dest
cp $(join-path $src odo.html.dll) $dest
cp $(join-path $src odo.mvc.dll)  $dest
cp $(join-path $src odo.core.pdb) $dest
cp $(join-path $src odo.html.pdb) $dest
cp $(join-path $src odo.mvc.pdb)  $dest
