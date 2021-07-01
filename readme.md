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

## Amazon elastic compute cloud (EC2)

EC2 instances are like virtual machine, it has a CPU, RAM, OS, drive space and a network interface.

<img src="images/img6.png" width="70%" alt="EC2 diagram">

The instances can have a public, private or elastic IP address. The public IP changes every time that the instance stops, the private is used for internal use and it is retained when the instance stops, the elastic is a static public IP and it is associated to the private IP of the instance.

<img src="images/img7.png" width="70%" alt="Private subnets">

The NAT (network address translation) gateway receives the traffic from the private IP and fowards the connection to the internet gateway using a elastic IP.

Before lauching the EC2 instance we need to define the Amazon Machine Image(AMI), the Instance types (e.g. t2.micro)

1. choose an Amazon Machine Image (AMI):

<img src="images/img8.png" width="70%" alt="Choose amazon machine image">

2. Choose the instance type:

<img src="images/img9.png" width="70%" alt="Choose the instance type">

3. Instance details (for example I can add the instance in a specific subnet):

<img src="images/img10.png" width="70%" alt="Choose instance details">

4. Add storage and volume type:

<img src="images/img11.png" width="70%" alt="Choose storage">

5. Create a security group:<br>
   The default group gives access to the PORT 22 with the SSH key.

<img src="images/img12.png" width="70%" alt="Add security groups">

6. Create a key pair to access the instance:

<img src="images/img13.png" width="70%" alt="Create a key pair">

### Connecting to an Amazon EC2 instance:

When I connect to my instance I need to change the permission of the KP (key pair):
chmod 400 keyPairName.pem

To connect to the instance using the public IP address:
ssh -i "keyPairName.pem" ec2-user@PublicIPAddress

To install the dependencies in the instance we run:

sudo yum update -y : yum is used to install or update packages on Linux
sudo yum install httpd -y: Install the Apache web server
sudo systemctl start httpd
sudo systemctl enable httpd
echo "This is a test to run an Apache EC2 instance" | sudo tee -a /var/www/html/index.html : tee -a appends content to a file when I cannot use the > command (I can also try chmod +w index.html)

to confirm if the content was added:
cat /var/www/html/index.html
curl "IPv4 address here"

I also need to allow the access to HTTP adding another rule to the security group:
<img src="images/img14.png" width="70%" alt="Add inbound rule">
curl localhost:PORTnumber

PS: To run in the browser I need to change HTTPS to HTTP

<!-- Using access keys with EC2 -->

## Install node.js in a EC2 instance and deploy a simple server in it:

https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
https://sumantmishra.medium.com/how-to-deploy-node-js-app-on-aws-with-github-db99758294f1
PS: the port from my serve should be the same port exposed in the security group

https://www.youtube.com/watch?v=LBbq3CgCux8&ab_channel=BackSpaceAcademy

## Deploy a simple static page using S3:

1. Create a cloudFront

   <img src="images/img15.png" width="70%" alt="Create a cloudFront">

2. Go to S3 on AWS website and choose cloudforbegginersnetbucket
3. Permissions: turn off the block all public access
   Go to access control list -> public access -> list objects
4. Add files, select them and make them public (in the exemple he added a index.html, error.html, img.jpeg)
5. Properties -> static website hosting -> use this bucket to host a website -> index document: index.html
   error document: error.html -> check if the link is working
6. Go to cloudFront distribution on AWS website -> select Web option -> origin domain: choose the s3 bucket name -> Restrict bucket access: yes -> origin access indentity: Create a new identity (cloudFront will be able to change de policies) -> grant read permission on Bucket: yes -> create it
7. Copy the domain name: domainurl/index.html

## AWS CLI commands:

- This command will add the security credentials: aws configure
it will also ask for the aws region and the data format.
I can also define custom profiles and use them use the flag --profile nameOfProfile

  <img src="images/img16.png" width="70%" alt="Define custom profiles">

- To add the credentials as environment variables instead of saving the credentials in a file:

  export AWS_ACCESS_KEY_ID = value
  export AWS_SECRET_ACCESS_KEY = value
  export AWS_DEFAULT_REGION = eu-central-1 (this is Frankfurt)

  to check the variables: printenv | grep AWS

- After lauching a EC2 instance I need a keypair:

  aws ec2 create-key-pair --key-name NameKeyPair --query 'KeyMaterial' --output text > NamePair.pem

  Set the permission for the keypair: chmod 400 NameKeyPair.pem

  Display a keypair: aws ec2 describe-key-pairs

  Delete a keypair: aws ec2 delete-key-pair --key-name NameKeyPair

<!-- 32:09 -->
