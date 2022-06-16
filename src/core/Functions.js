const core = {}

core.shuffle = (input) => {
  let a = input
  var aLength = a.length
  for (var i = aLength - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1))
    var itemAtIndex = a[randomIndex]
    a[randomIndex] = a[i]
    a[i] = itemAtIndex
  }
  return a
}

core.randomEntry = (input) => {
  if (input) {
    const seed = Math.random()
    let ix = 0
    // Set Sara probability to 50%
    if (Number.parseFloat(seed) < 0.5) {
      ix = 0
    } else {
      ix = Math.floor(Math.random() * input.length)
    }
    return input[ix]
  }
}

core.randomNumber = (max = 10) => {
  // TODO: Invalid when max is 1
  return ~~(Math.random() * max) + 1
}

export default core
