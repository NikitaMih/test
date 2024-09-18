
/**
 * Переводит строку даты к state
 * @date 2021-10-21
 * @param {string} date
 * @returns {string}
 */
export const dateToState = (date) => {
  if (!date) {
    return null;
  }
  let dateSplits = date.split('.');
  let newDate = dateSplits ? `${dateSplits[2]}-${dateSplits[1]}-${dateSplits[0]}` : null;
  return newDate;
}
/**
 * Переводит строку даты к платежу
 * @date 2021-10-21
 * @param {string} date
 * @returns {string}
 */
 export const stateToDate = (date) => {
   if (!date) {
     return null;
   }
  let dateSplits = date.split('-');
  let newDate = `${dateSplits[2]}.${dateSplits[1]}.${dateSplits[0]}`;
  return newDate;
}
