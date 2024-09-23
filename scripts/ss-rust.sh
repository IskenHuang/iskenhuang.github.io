#!/bin/bash

if [ $1 = "restart" ]; then
    echo "restart start"
    # sudo systemctl restart snap.shadowsocks-rust.ssserver-daemon.service
elif [[ $1 = "status" ]]; then
    sudo systemctl status snap.shadowsocks-rust.ssserver-daemon.service
elif [[ $1 = "log" ]]; then
    sudo journalctl -u snap.shadowsocks-rust.ssserver-daemon.service
elif [[ $1 = "config" ]]; then
    sudo vim /var/snap/shadowsocks-rust/common/etc/shadowsocks-rust/config.json

    # service restart to update config
    sudo systemctl restart snap.shadowsocks-rust.ssserver-daemon.service
elif [[ $1 = "init" ]]; then
    echo "Start init script"
    snap install shadowsocks-rust
    snap services shadowsocks-rust
    snap start --enable shadowsocks-rust.ssserver-daemon

    # update auto update time
    snap set system refresh.timer=tue,2:00-6:00
    snap refresh --time
    echo "End init script"
else
    echo "Only support cmds as below:
- init: init this service
- restart: service restart
- status: service status
- log: service log
- config: edit config"
fi
