import { getIflow } from "./api/iflow/serialize";
import { createPackage } from "./api/packages";

getIflow().then(console.log)