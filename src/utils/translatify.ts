export class Translatify {

  private readonly TRANSLATE: string = 'translate';

  private readonly translatableRegex: RegExp = /{{\s*'(.)+'\s*}}/g;

  private readonly translateKeyIdentifier: RegExp = /<!--GroupTranslateKey=([a-zA-Z])+-->/;

  public convertToExtract(content: string): string {
    let groupKey = this.getTranslateGroupKey(content);

    return this.modifyStringForTranslationExtraction(content, this.translatableRegex, groupKey);
  }

  private getTranslateGroupKey(content: string): string {
    let key: any = this.translateKeyIdentifier.exec(content);

    if (key) {
      return key[0].split('=')[1].replace('-->', '');
    }

    return null;
  }

  private modifyStringForTranslationExtraction(content: string, regex: RegExp, groupKey: string): string {
    let matches: RegExpExecArray;
    while (matches = regex.exec(content)) {
      if (matches) {
        let keyValue = matches[0].substring(matches[0].indexOf('\'') + 1, matches[0].lastIndexOf('\''));
        keyValue = '{{\'' + groupKey + '.' + keyValue + '\'' + ' | ' + this.TRANSLATE + ' }}';

        content = content.replace(matches[0], keyValue);
      }
    }

    return content;
  }
}
