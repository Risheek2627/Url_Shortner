let name = "Global";

function execute() {
  let name = "Scope";
  function printname() {
    console.log(name);
  }
  printname();
}
execute();
