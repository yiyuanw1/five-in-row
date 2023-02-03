enum Icon{
  Cyberman,
  Dalek,
  Zygon,
  Sontaran,
  Timelord,
  Judoon
}

function getString(icon: Icon) : string {
  const i = Icon[icon]
  return i
}

function getIcon(str: string) :Icon{

  return Icon[str as keyof typeof Icon]
}

export {Icon, getString, getIcon}