const wrapperUrl: URL = new URL('https://www.litivo.com');
const listarInsolvenciesUrl: URL = new URL('/insolvencia/listar', wrapperUrl);
const strongOptionDivSelector: string = 'div.ant-select-item-option-content > strong';
const plusSpanSelector: string = '+ span.ant-input-suffix';

export { listarInsolvenciesUrl, plusSpanSelector, strongOptionDivSelector, wrapperUrl };

