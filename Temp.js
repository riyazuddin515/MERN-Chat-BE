const users = [
    {
        _id: '630324ba4d10661e013a7cd9',
        email: 'fayaz@gmail.com',
        name: 'Fayaz',
        profilePic: 'https://www.nicepng.com/png/detail/522-5226533_get-beyond-the-usual-suspects-profile-pic-icon.png',
        createdAt: '2022-08-22T06:39:54.970Z',
        updatedAt: '2022-08-22T06:39:54.970Z',
        __v: 0
    },
    {
        _id: '630324b04d10661e013a7cd6',
        email: 'riyaz@gmail.com',
        name: 'Riyaz',
        profilePic: 'https://www.nicepng.com/png/detail/522-5226533_get-beyond-the-usual-suspects-profile-pic-icon.png',
        createdAt: '2022-08-22T06:39:44.823Z',
        updatedAt: '2022-08-22T06:39:44.823Z',
        __v: 0
    }
]

users.filter(user => user._id != '630324b04d10661e013a7cd6').forEach(({ _id }) => {
    console.log(_id)
})