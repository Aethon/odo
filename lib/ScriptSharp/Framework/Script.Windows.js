// Script# Windows Scripting APIs
//
function Shell(){try{return new ActiveXObject('WScript.Shell');} catch(ex){} return null;}
function FileSystemObject(){try{return new ActiveXObject('Scripting.FileSystemObject');} catch(ex){} return null;}
function FeedsManager(){try{return new ActiveXObject('Microsoft.FeedsManager');} catch(ex){} return null;}
if(System&&System.Gadget){window.Gadget=System.Gadget;window.Sidebar=System.Gadget.Sidebar;window.SideShow=System.Gadget.SideShow;window.EnvironmentService=System.Environment;window.TimeService=System.Time;window.SoundService=System.Sound;window.ShellService=System.Shell;ss.Debug.assert=function Gadgets$Debug$assert(condition,message){if(!condition){message=message+'\r\n\r\nBreak into debugger?';var shell=new Shell();if(shell.Popup(message,0,'Assert Failed',20)==6){ss.Debug._fail(message);}}};ss.Debug.writeLine=function Gadgets$Debug$writeLine(message){System.Debug.outputString(message+'\r\n');}}