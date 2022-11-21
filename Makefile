
# ------------------------------------- evaluación -----------------------------
.PHONY:test
test: ./deno
	./deno test

.PHONY:test_date
test_date:
	@TZ='America/Argentina/Buenos_Aires' test `date  +%s` -lt `date -d "$$RECOMMENDED_DATE" +%s` || (echo "Ya pasó la fecha de entrega" && exit 1)

.PHONY:test_late_date
test_late_date:
	@TZ='America/Argentina/Buenos_Aires' test `date  +%s` -lt `date -d "$$RECOMMENDED_LATE_DATE" +%s` || (echo "Ya pasó la fecha de entrega tardía" && exit 1)

.PHONY:test_extra
test_extra: ./deno
	./deno test --allow-all --filter extra

define EXTRA_REGEX
s/.* \([0-9]\+\) passed.*/\1/g
endef
export EXTRA_REGEX
.PHONY:test_extra_quantity
test_extra_quantity:
	@(test `make test_extra | grep "passed" | sed -e "$$EXTRA_REGEX"` -ge 5) || (echo "No se encuentran 5 ó más tests con la palabara 'extra'." && exit 1)

.PHONY:test_if
test_while: ./deno
	./deno test --allow-all --filter "while:"

.PHONY:test_checksum
test_checksum:
	@sha256sum -c shasums.txt || (echo "\n!!!!!! FALLA EN LOS CHECKSUM \n!!!!!! Recupere la versión original de los archivos cuyo checksum falló por medio de git checkout." && exit 1)

# ---------------------------------- deno .vscode ------------------------------------

define LAUNCH_JSON
{
    "configurations": [
        {
            "name": "Current file",
            "request": "launch",
            "program":"${file}",
            "cwd":"${workspaceFolder}",
            "runtimeExecutable": "${workspaceFolder}/deno",
            "runtimeArgs": ["run", "--inspect-brk=127.0.0.1:9229","-A"],
            "attachSimplePort": 9229,
            "type": "node"
        },{
            "name": "Launch tests",
            "request": "launch",
            "program":"${file}",
            "cwd":"${workspaceFolder}",
            "runtimeExecutable": "${workspaceFolder}/deno",
            "runtimeArgs": ["test", "--inspect-brk=127.0.0.1:9229","-A"],
            "attachSimplePort": 9229,
            "type": "node"
        }
    ]
}
endef
export LAUNCH_JSON

.vscode/launch.json: .vscode
	echo "$$LAUNCH_JSON" > .vscode/launch.json

define SETTINGS_JSON
{
  "deno.path": "./deno",
  "deno.enable": true,
  "files.eol": "\\n"
}
endef
export SETTINGS_JSON

.vscode/settings.json: .vscode
	echo "$$SETTINGS_JSON" > .vscode/settings.json

define EXTENSIONS_JSON
{
    "recommendations": ["denoland.vscode-deno"]
}
endef
export EXTENSIONS_JSON

.vscode/extensions.json: .vscode
	echo "$$EXTENSIONS_JSON" > .vscode/extensions.json

.vscode:
	mkdir .vscode

vscode: .vscode/extensions.json .vscode/settings.json .vscode/launch.json

deno:
	curl -fsSL https://deno.land/install.sh | DENO_INSTALL=./d sh -s "v1.26.0"
	mv ./d/bin/deno ./deno
	rm -rf ./d

setup: deno .vscode .vscode/settings.json .vscode/launch.json .vscode/extensions.json