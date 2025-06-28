function nicknameSort(data) {
    const sortedNickname = [...data].sort((member1, member2) => {
        const isMember1Off = member1.off === true;
        const isMember2Off = member2.off === true;
        if (isMember1Off && !isMember2Off) return 1;
        if (!isMember1Off && isMember2Off) return -1;
        return member1.nickname.localeCompare(member2.nickname, 'en');
    });
    return sortedNickname;
}

export default nicknameSort;