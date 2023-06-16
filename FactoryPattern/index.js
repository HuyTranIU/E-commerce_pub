// const serviceLogistics = (cargoVolum) => {
//   switch (cargoVolum) {
//     case "10": {
//       return {
//         name: "Truck 10",
//         price: "100.000 VND",
//         doors: 6,
//       };
//     }
//     case "20": {
//       return {
//         name: "Truck 20",
//         price: "1.000.000 VND",
//         doors: 10,
//       };
//     }
//   }
// };

// // Simple Factory Pattern
// class ServiceLogistics {
//   constructor(name = "Truck 10", price = "100.000 VND", doors = 6) {
//     this.name = name;
//     this.price = price;
//     this.doorNumber = doors;
//   }

//   static getTransport = (cargoVolum) => {
//     switch (cargoVolum) {
//       case "10": {
//         return new ServiceLogistics();
//       }
//       case "20": {
//         return new ServiceLogistics("Truck 20", "1.000.000 VND", 20);
//       }
//     }
//   };
// }

// console.log("With Factory Pattern::", ServiceLogistics.getTransport("10"));

// Factory Method Pattern
class Car {
  constructor({
    name = "Car 10",
    price = "100.000 VND",
    doors = 6,
    customerInfo = {},
  }) {
    this.name = name;
    this.price = price;
    this.doors = doors;
    this.customInfo = customerInfo;
  }
}

class ServiceLogistics2 {
  transportClass = Car;
  getTransport = (customerInfo) => {
    return new this.transportClass(customerInfo);
  };
}
const carService = new ServiceLogistics2();
console.log(
  "carService::",
  carService.getTransport({
    customerInfo: {
      name: "Car",
      price: "100.000 VND",
      cargoVolum: "1000kg",
    },
  })
);

// Mở rộng
// Cách 1
// class Truck {
//   constructor({
//     name = "Truck 10",
//     price = "100.000.000 VND",
//     doors = 14,
//     customerInfo = {},
//   }) {
//     this.name = name;
//     this.price = price;
//     this.doors = doors;
//     this.customerInfo = customerInfo;
//   }
// }

// carService.transportClass = Truck;
// console.log(
//   "TruckService::",
//   carService.getTransport({
//     customerInfo: {
//       name: "Truck",
//       price: "100.000.000 VND",
//       cargoVolum: "1000kg",
//     },
//   })
// );

// Cách 2
// class TruckService111 extends ServiceLogistics2 {
//   transportClass = Truck;
// }

// const truckService11 = new TruckService111();
// console.log(
//   "TruckService2222::",
//   truckService11.getTransport({
//     customerInfo: { name: "BMV", price: "100.000.000.000 VND", doors: 4 },
//   })
// );
// Abstract Factory Pattern
