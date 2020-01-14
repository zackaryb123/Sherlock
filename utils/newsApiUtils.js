export function determineNewsOption(article) {
  const titleArr = article.title.split(' ');
  const descArr = article.description.split(' ');
  const keyQueries = titleArr.filter(word => descArr.includes(word));
  let camelCaseKeyQueries = [];
  keyQueries.map(word => {
    if (word.charAt(0) === word.charAt(0).toUpperCase())
      camelCaseKeyQueries.push(word);
  });
  return camelCaseKeyQueries;
}