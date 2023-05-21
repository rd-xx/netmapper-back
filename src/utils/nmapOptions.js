export const availableInputOptions = [
  {
    key: "p",
    label: "Port",
    validator: /^p=((\d+|(\d+-\d+))(,(\d+|(\d+-\d+)))*)$/, // matches p=443,80-90,1000-2000,3000
    clientSideValidator: /^(\d+|(\d+-\d+))(,(\d+|(\d+-\d+)))*$/, // matches 443,80-90,1000-2000,3000
  },
]

export const availableNoInputOptions = [
  "sL",
  "sn",
  "Pn",
  "sS",
  "sU",
  "sO",
  "F",
  "r",
  "sV",
  "sC",
  "O",
  "A",
]
