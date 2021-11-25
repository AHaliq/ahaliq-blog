{ mkDerivation, base, hakyll, lib, time, digest, fsnotify, JuicyPixels, pandoc }:
mkDerivation {
  pname = "ahaliq-blog";
  version = "0.1.0.0";
  src = ./.;
  isLibrary = false;
  isExecutable = true;
  executableHaskellDepends = [ base hakyll time digest fsnotify JuicyPixels pandoc];
  license = "unknown";
  hydraPlatforms = lib.platforms.none;
}
