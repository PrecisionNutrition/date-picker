with (import <nixpkgs> {});
let
  pn_overlay = import (builtins.fetchTarball https://github.com/PrecisionNutrition/nixpkgs-pn/archive/0.0.3.tar.gz);

  pkgs = import <nixpkgs> { overlays = [ pn_overlay ]; };


  inputs = pkgs.shellStuff.emberPkgs;
  hooks = pkgs.shellStuff.emberShellHooks;

in stdenv.mkDerivation {
  name = "date-picker";
  buildInputs = inputs;
  shellHook = hooks;
}
