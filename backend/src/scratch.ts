import { Either } from "./shared/domain/Either";

const ok = Either.right<string, number>(42);
const fail = Either.left<string, number>("Error occurred");

console.log(ok.isRight(), ok.value); // true
console.log(fail.isRight(), fail.value); // false