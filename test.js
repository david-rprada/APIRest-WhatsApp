const add = (num1, num2) => new Promise((resolve) => resolve(num1 + num2))

add(2, 4)
  .then((result) => {
    console.log(result) // result: 6
    return result + 10;
  })
  .then((result) => {
    console.log("Segunda promsea then: " + result) // result: 16
    new ClaseNoExistente("No existe!");
    return result;
  })
  .then((result) => {
    console.log("Tercera promsea then: " + result) // result: 16
    new ClaseNoExistente2("No existe 2!");
  })
  .catch((error) => { console.log("Error en catch!: " + error)})
  .then((result) => console.log("All done!"));