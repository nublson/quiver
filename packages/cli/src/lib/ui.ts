const TTY = Boolean(process.stdout.isTTY)

function ansi(open: string, close: string) {
  return (s: string) => (TTY ? `[${open}m${s}[${close}m` : s)
}

export const dim = ansi('2', '22')
export const green = ansi('32', '39')
export const yellow = ansi('33', '39')
export const cyan = ansi('36', '39')
