export function splitConsigneeName(fullname: string) {
    const hyphenated = [
        '欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人',
        '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫', '宗政', '濮阳', '公冶',
        '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '城池', '司徒',
        '鲜于', '司空', '汝嫣', '闾丘', '子车', '亓官', '司寇', '巫马', '公西', '颛孙',
        '壤驷', '公良', '漆雕', '乐正', '宰父', '谷梁', '拓跋', '夹谷', '轩辕', '令狐',
        '段干', '百里', '呼延', '东郭', '南门', '羊舌', '微生', '公户', '公玉', '公仪',
        '梁丘', '公仲', '公上', '公门', '公山', '公坚', '左丘', '公伯', '西门', '公祖',
        '第五', '公乘', '贯丘', '公皙', '南荣', '东里', '东宫', '仲长', '子书', '子桑',
        '即墨', '达奚', '褚师'
    ];
    let hyset = new Set(hyphenated);
    let vLength = fullname.length;
    let lastname = '', firstname = '';

    if(fullname.includes(' ')) {
        firstname = fullname.split(' ')[0];
        lastname = fullname.split(' ')[1];
        return [lastname, firstname];
    }

    if (vLength > 2) {
        var preTwoWords = fullname.slice(0, 2);
        if (hyset.has(preTwoWords)) {
            lastname = preTwoWords;
            firstname = fullname.slice(2);
        } else {
            lastname = fullname.slice(0, 1);
            firstname = fullname.slice(1);
        }
    } else if (vLength === 2) {
        lastname = fullname.slice(0, 1);
        firstname = fullname.slice(1);
    } else {
        lastname = fullname;
    }
    return [lastname, firstname];
}

export function joinConsigneeName(firstName: string, lastName: string): string {
    const isChinese = (str: string) => {
        return /^[\u4e00-\u9fa5]+$/.test(str);
    };

    if (isChinese(lastName) || isChinese(firstName)) {
        return `${lastName}${firstName}`;
    } else {
        return `${lastName} ${firstName}`;
    }
}