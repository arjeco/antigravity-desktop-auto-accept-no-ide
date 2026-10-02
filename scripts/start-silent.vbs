Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
ScriptDir = FSO.GetParentFolderName(WScript.ScriptFullName)
RootDir = FSO.GetParentFolderName(ScriptDir)
WshShell.CurrentDirectory = RootDir
WshShell.Run "node index.js", 0, False
