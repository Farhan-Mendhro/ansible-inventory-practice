# ⚙️ Ansible Inventory & Server Grouping — DevOps Practice

> Practicing infrastructure automation using Ansible inventory files, server grouping, and passwordless SSH authentication across AWS EC2 instances via WSL.

![Ansible](https://img.shields.io/badge/Ansible-2.x-EE0000?style=flat-square&logo=ansible&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?style=flat-square&logo=amazon-aws&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-24.04_LTS-E95420?style=flat-square&logo=ubuntu&logoColor=white)
![WSL](https://img.shields.io/badge/WSL-Ubuntu-0078D6?style=flat-square&logo=windows&logoColor=white)

---

## 📋 Table of Contents

- [🏗️ Project Overview](#️-project-overview)
- [🗺️ Architecture](#️-architecture)
- [📁 Inventory File](#-inventory-file)
- [🔑 Passwordless Authentication Setup](#-passwordless-authentication-setup)
- [⚡ Key Commands](#-key-commands)
- [💡 Concepts Covered](#-concepts-covered)

---

## 🏗️ Project Overview

This project demonstrates the foundational Ansible skill of **inventory management** — defining and grouping servers so Ansible knows which machines to automate and how to connect to them.

**What was practiced:**
- Provisioned **2 AWS EC2** instances (Ubuntu 24.04 LTS)
- Configured **passwordless SSH authentication** from WSL to both servers
- Created an **Ansible inventory file** in INI format
- Organized servers into **named groups** (`webservers`, `dbservers`)
- Ran **ad-hoc commands** and **ping tests** against groups

---

## 🗺️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CONTROL NODE                       │
│              WSL / Ubuntu (Local PC)                 │
│                  ansible-playbook                    │
└───────────────────────┬─────────────────────────────┘
                        │  SSH (port 22)
              ┌─────────┴──────────┐
              ▼                    ▼
┌─────────────────────┐  ┌─────────────────────┐
│   [webservers]      │  │    [dbservers]       │
│      web01          │  │       db01           │
│  AWS EC2 t2.micro   │  │  AWS EC2 t2.micro    │
│  Ubuntu 24.04 LTS   │  │  Ubuntu 24.04 LTS    │
│  18.xxx.xx.10       │  │  18.xxx.xx.11        │
└─────────────────────┘  └─────────────────────┘
```

---

## 📁 Inventory File

The inventory file defines all managed nodes, their connection details, and group membership.

```ini
# ~/ansible-project/inventory.ini

# ─── Web Servers ──────────────────────────────────────
[webservers]
web01 ansible_host=18.xxx.xx.10 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/aws-key.pem

[webservers:vars]
http_port=80
ansible_python_interpreter=/usr/bin/python3

# ─── Database Servers ─────────────────────────────────
[dbservers]
db01 ansible_host=18.xxx.xx.11 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/aws-key.pem

# ─── Global Variables ─────────────────────────────────
[all:vars]
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
```

### Inventory Graph

```
@all:
  |--@webservers:
  |  |--web01
  |--@dbservers:
  |  |--db01
  |--@ungrouped:
```

---

## 🔑 Passwordless Authentication Setup

Ansible requires passwordless SSH access to all managed nodes. Here's the exact setup used:

**Step 1 — Generate SSH Key Pair on WSL**
```bash
ssh-keygen -t rsa -b 4096
# Press Enter to accept defaults
# Keys saved to: ~/.ssh/id_rsa and ~/.ssh/id_rsa.pub
```

**Step 2 — Copy Public Key to EC2 Instances**
```bash
# Copy to web server
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@<web01-public-ip>

# Copy to database server
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@<db01-public-ip>
```

**Step 3 — Verify Passwordless Login**
```bash
# Should connect without asking for a password
ssh ubuntu@<web01-public-ip>
ssh ubuntu@<db01-public-ip>
```

> ⚠️ **Note:** Ensure **Port 22** is open in the EC2 Security Group's Inbound Rules for SSH to work.

---

## ⚡ Key Commands

### Test Connectivity

```bash
# Ping all hosts in the inventory
ansible all -i inventory.ini -m ping

# Ping only the webservers group
ansible webservers -i inventory.ini -m ping

# Ping only the dbservers group
ansible dbservers -i inventory.ini -m ping
```

Expected output:
```
web01 | SUCCESS => { "ping": "pong" }
db01  | SUCCESS => { "ping": "pong" }
```

### Inspect the Inventory

```bash
# List all hosts and their variables
ansible-inventory -i inventory.ini --list

# See a visual graph of groups and hosts
ansible-inventory -i inventory.ini --graph
```

### Run Ad-Hoc Commands

```bash
# Check uptime on all servers
ansible all -i inventory.ini -m command -a "uptime"

# Check uptime on only dbservers
ansible dbservers -i inventory.ini -m command -a "uptime"

# Gather system facts from webservers
ansible webservers -i inventory.ini -m setup
```

---

## 💡 Concepts Covered

| Concept | Description |
|---|---|
| **Inventory File** | Defines all managed nodes in INI format with host variables and group assignments |
| **Server Grouping** | Logical grouping of hosts (`[webservers]`, `[dbservers]`) to target commands at specific roles |
| **Group Variables** | `[webservers:vars]` block to set variables for all hosts in a group |
| **Passwordless SSH** | RSA key-pair authentication so Ansible connects without a password prompt |
| **Ad-Hoc Commands** | One-off Ansible commands using `-m` (module) flag without writing a playbook |
| **Ping Module** | The `ansible -m ping` module used to verify host connectivity |
| **AWS EC2** | Cloud-provisioned Ubuntu instances serving as managed nodes |
| **WSL** | Windows Subsystem for Linux used as the Ansible control node |

---




<div align="center">
  <sub>Built for DevOps learning · Ansible · AWS EC2 · WSL · Passwordless SSH</sub>
</div>
