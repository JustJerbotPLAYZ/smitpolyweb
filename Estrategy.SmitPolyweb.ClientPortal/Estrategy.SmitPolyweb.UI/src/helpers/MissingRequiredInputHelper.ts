import global from "../css/global.module.css";
export function CheckForMissingRequiredFields(elements: { name: string, value: unknown }[]): boolean {
  let missingFound = false;
  elements.forEach(({ name, value }) => {
    const element = document.getElementById(name);
    if (element) {
      if (!value) {
        element.classList.add(global.missingInput);
        missingFound = true;
      } else {
        element.classList.remove(global.missingInput);
      }
    }
  });
  return missingFound;
}
