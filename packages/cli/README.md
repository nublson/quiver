cli
=================

CLI sync layer for agent skills


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/cli)
[![Downloads/week](https://img.shields.io/npm/dw/cli.svg)](https://npmjs.org/package/cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cli
$ quiver COMMAND
running command...
$ quiver (--version)
cli/0.0.0 darwin-arm64 node-v25.2.1
$ quiver --help [COMMAND]
USAGE
  $ quiver COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`quiver hello PERSON`](#quiver-hello-person)
* [`quiver hello world`](#quiver-hello-world)
* [`quiver help [COMMAND]`](#quiver-help-command)
* [`quiver plugins`](#quiver-plugins)
* [`quiver plugins add PLUGIN`](#quiver-plugins-add-plugin)
* [`quiver plugins:inspect PLUGIN...`](#quiver-pluginsinspect-plugin)
* [`quiver plugins install PLUGIN`](#quiver-plugins-install-plugin)
* [`quiver plugins link PATH`](#quiver-plugins-link-path)
* [`quiver plugins remove [PLUGIN]`](#quiver-plugins-remove-plugin)
* [`quiver plugins reset`](#quiver-plugins-reset)
* [`quiver plugins uninstall [PLUGIN]`](#quiver-plugins-uninstall-plugin)
* [`quiver plugins unlink [PLUGIN]`](#quiver-plugins-unlink-plugin)
* [`quiver plugins update`](#quiver-plugins-update)

## `quiver hello PERSON`

Say hello

```
USAGE
  $ quiver hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ quiver hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/packages/cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `quiver hello world`

Say hello world

```
USAGE
  $ quiver hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ quiver hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/packages/cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `quiver help [COMMAND]`

Display help for quiver.

```
USAGE
  $ quiver help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for quiver.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.49/src/commands/help.ts)_

## `quiver plugins`

List installed plugins.

```
USAGE
  $ quiver plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ quiver plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/index.ts)_

## `quiver plugins add PLUGIN`

Installs a plugin into quiver.

```
USAGE
  $ quiver plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into quiver.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the QUIVER_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the QUIVER_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ quiver plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ quiver plugins add myplugin

  Install a plugin from a github url.

    $ quiver plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ quiver plugins add someuser/someplugin
```

## `quiver plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ quiver plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ quiver plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/inspect.ts)_

## `quiver plugins install PLUGIN`

Installs a plugin into quiver.

```
USAGE
  $ quiver plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into quiver.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the QUIVER_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the QUIVER_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ quiver plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ quiver plugins install myplugin

  Install a plugin from a github url.

    $ quiver plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ quiver plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/install.ts)_

## `quiver plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ quiver plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ quiver plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/link.ts)_

## `quiver plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ quiver plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ quiver plugins unlink
  $ quiver plugins remove

EXAMPLES
  $ quiver plugins remove myplugin
```

## `quiver plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ quiver plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/reset.ts)_

## `quiver plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ quiver plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ quiver plugins unlink
  $ quiver plugins remove

EXAMPLES
  $ quiver plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/uninstall.ts)_

## `quiver plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ quiver plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ quiver plugins unlink
  $ quiver plugins remove

EXAMPLES
  $ quiver plugins unlink myplugin
```

## `quiver plugins update`

Update installed plugins.

```
USAGE
  $ quiver plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/update.ts)_
<!-- commandsstop -->
