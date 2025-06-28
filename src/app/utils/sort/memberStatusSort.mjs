function memberStatusSort(data) {
    const statusSort = [...data].sort((member1, member2) => {
        const isMember1Off = member1.off === true;
        const isMember2Off = member2.off === true;
        if (isMember1Off && !isMember2Off) return 1;
        if (!isMember1Off && isMember2Off) return -1;
        return (member2.status - member1.status);
    });
    return statusSort;
}

export default memberStatusSort;