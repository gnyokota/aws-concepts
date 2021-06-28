# AWS concepts

### Information from:

AWS Basics for Beginners - Full Course
https://www.youtube.com/watch?v=ulprqHHWlng&ab_channel=freeCodeCamp.org

## VPC

VPC is a logically isolated portion of AWS cloud within a region.
Different subnets can be created for different data centers.
Internet gateway is necessary to connect to the internet, because the EC2 instances are
launched within the subnets with and local ip address.
AWS creates a default VPC.
<img src="images/img1.png" width="70%" alt="VPC diagram">

The subnets can also have custom ACL rules (access control lists):
<img src="images/img2.png" width="70%" alt="ACL inbound rules">

## Stateful vs stateless firewalls

Stateful allows the return traffic automatically without checking a inbound rule. On the other hand, stateless firewall check the rules for both connections.
<img src="images/img3.png" width="70%" alt="firewall types">
<img src="images/img4.png" width="70%" alt="security group vs network ACL">

## AWS Public and Private services

For example, if your EC2 wants to connect to the Amazon S3 needs to go throught the internet gateway.
<img src="images/img5.png" width="70%" alt="public and private aws services">
