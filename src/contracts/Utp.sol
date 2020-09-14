pragma solidity >=0.4.21 <0.6.0;

contract Utp {
    uint256 public userCount = 0;
    mapping(uint256 => User) public users;

    struct User {
        uint256 id;
        string username;
        string password;
        address payable owner;
    }

    function setUser(string memory _username, string memory _password) public {
        userCount++;
        users[userCount] = User(userCount, _username, _password, msg.sender);
    }

    function updatePassword(uint256 _id, string memory _password) public {
        User memory _user = users[_id];
        _user.password = _password;
        users[_id] = _user;
    }
}
