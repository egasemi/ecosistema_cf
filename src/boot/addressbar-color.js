import { boot } from "quasar/wrappers";
import { AddressbarColor } from "quasar";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  AddressbarColor.set("#d31c22b3");
});
