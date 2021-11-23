
build:
	nix-shell --run 'cabal new-run site build'

clean:
	nix-shell --run 'cabal new-run site clean'

watch:
	nix-shell --run 'cabal new-run site watch'