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

## Scaling with EC2 autoscaling:

<img src="images/img17.png" width="70%" alt="Autoscaling diagram">

1. Create a launch configuration for autoscaling:

Go to the auto scaling -> launch configuration

<img src="images/img18.png" width="70%" alt="Autoscaling launch">

Create lauching configuration -> give it a name -> chose the machine image type (using the id) and the free tier t2.micro
<img src="images/img19.png" width="70%" alt="Create launch configuration">

Select the monitoring, but maybe we will need to pay for it, because it is a detailed monitoring.
In the advanced information fill the user data with the initial script running in the root user. For example:
#!/bin/bash
<img src="images/img20.png" width="70%" alt="Script to launch ec2 instance">

or run just run a simple nodejs server. The stress-ng is used to bombard the server.
The storage type is the default. We create a new security group:

SSH=22 from aywhere
CUSTOM TCU HTTP=80 from aywhere - it is important the security group to listen to the same port from the load balancer.

Create a new key pair

2. Create an autoscaling group:

In the lauch configuration we select switch to lauch template -> next
<img src="images/img21.png" width="70%" alt="Autoscaling group">

Choose the default VPC and two different availability zones -> next
<img src="images/img22.png" width="70%" alt="Autoscaling group network">

Attach to a new load balance -> application load balancer -> internet-facing -> next
<img src="images/img23.png" width="70%" alt="Load balancer configuration">

Listener and target group -> health check: EC2 and 100 seconds -> next
<img src="images/img24.png" width="70%" alt="Listener and target group">

Desired capacity: 1
Minimun capacity: 1
Maximun capacity: 3
-> Scaling policy: target tracking policy and choose the avarage CPU utilization (the requirement was 50%):50 -> Instances need (to warm up):100 seconds -> uncheck the disable scale in to create only a scale-out policy -> uncheck enable scale-in -> next -> next -> add tags -> create auto scaling group

3. Create a target group for the instances:

The target group was already created in the autoscaling configuration:
<img src="images/img25.png" width="70%" alt="Target group">

4. Create a load balance application for the instances:

The load balancer was already created in the autoscaling configuration:
<img src="images/img26.png" width="70%" alt="Load balancer">

also check the litiner tab, it should show HTTP=80, I can also add more rules.

Get inside the EC2 instance use the SSH key -> curl localhost:80 -> send a request to the load balancer: curl DNS of the load balancer (load balance is not reaching the webserver if you get a bad request)

<!-- 1:15 -->

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

- To connect to a EC2 instance:

  connect to the instance:ssh -i my_ec2_private_key.pem ec2-user@EC2_DNS_NAME

  install the instance packages: sudo yum install ec2-instance-connect

  verify that instance connect was successfully installed: sudo less /etc/ssh/sshd_config

  to see all instances running: aws ec2 describe-instances

  to create tags in the EC2 instance: aws ec2 create-tags --resource INSTANCE_ID --tags Key=aws_demo, value=demo

  delete EC2 instance: aws ec2 terminate-instances --instance-ids EC2_INSTANCE_ID

  delete key pairs: aws ec2 delete-key-pair --key-name NAME_KEYPAIR

- S3 bucket:

  list the buckets: aws s3 ls

  create a s3 bucket: aws s3 mb s3://BUCKET_NAME

  copy files to my s3 bucket: aws s3 cp FILE_PATH s3://BUCKET_NAME
  copy files to my s3 bucket in a specific folder: aws s3 cp FILE_PATH s3://BUCKET_NAME/FOLDER_NAME

  check the files inside my bucket: aws s3 ls s3://BUCKET_NAME

  sync a local folder to your s3 bucket: aws s3 sync SOURCE_PATH s3://BUCKET_NAME/FOLDER_NAME

  sync and delete a file: aws s3 sync SOURCE_PATH s3://BUCKET_NAME/FOLDER_NAME --delete

  sync in the opposit direction: aws s3 sync s3://BUCKET_NAME/FOLDER_NAME SOURCE_PATH

  remove a file from s3 bucket: aws s3 rm s3://BUCKET_NAME/FOLDER_NAME SOURCE_PATH/FILE_NAME

  move files between folders or between aws and local machine: aws s3 mv s3://BUCKET_NAME/FOLDER_NAME FILE_PATH

  move the opposit direction: aws s3 mv FILE_PATH s3://BUCKET_NAME/FOLDER_NAME

  delete s3 bucket (even if is not empty): aws s3 rb s3://BUCKET_NAME --force
