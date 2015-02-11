---
published: true
layout: post
title: Almost there!
---
Hello everyone,

Over the last few weeks, I've been very hands on in making sure that everything is in order. That means a lot of work on the software, a lot of work on the hardware, and as you can see, a little bit of work on neglecting this blog.

## The power supply and power management

Power supplies are unregulated and often don't adhere to their advertised specifications. Most people used their microUSB phone chargers when the Pi first came out and this was the first time they were really stress tested. Charging a phone does not take a lot of current and as a result manufacturers are often not too concerned whether their power supply performs as advertised. If you've used the Raspberry Pi, you'll likely know about the importance of a good power supply. Without one you can experience lockups, crashes and issues with connected peripherals such as hard drives and WiFi dongles. This would be simply unaccceptable for Vero.

As you can see [here] (http://www.righto.com/2012/10/a-dozen-usb-chargers-in-lab-apple-is.html), there are a lot of bad power supplies out there. We are lucky in the sense that all of our outputs on Vero are digital (and thus less vulnerable to power supply noise) however it is vital that we have as stable a power supply as possible.

I have aggressively tested over a dozen power supplies myself. When doing so, here's what I was on the look out for:

* Noise -- how efficient is the charger and will it affect any peripherals connected to the Vero?
* Regulation -- are there any abnormal spikes in the current when the Vero's demand for power fluctuates? We want to avoid any power surges that could damage connected peripherals as well.

Initially, we had something that looked a little like this:

![Initial power supply scope](http://progress.getvero.tv/assets/oscillating_ripple.png "Initial power supply scope")

Your first conclusion may be that the PSU here is not very well regulated. The first thing worth noting, is that I am sampling at 20.0m/V div. We only need to be concerned if we see something like this at the 150m/V mark. However I did this because I wanted to stress the power supply and ensure that any demand the Vero needs is easily appeased by the power supply. Here what we see is not actually a problem with the power supply, but instead with our power management (discussed later).

My tests were initially done with a vanilla Linux kernel which did not have any OSMC CPU governor changes to it. What we are seeing here is overly-aggressive power management. Entering a menu would cause the CPU to exit its deepest sleep state and then go back down (which is why we see consistent ripple). So the challenge was to implement a new power management scheme for Vero. When doing so, we need to make sure:

* We are fast enough to adapt to changes in workload so that the user does not have any 'lag' in the user interface
* We are not so fast that we end up oscillating (as shown above)
* We are conservative in that we do not waste energy or heat.

All of these criteria were addressed with optimisations to the Linux CPU governor. By fine tuning the 'ondemand' governor, I have managed to get some good results.

Here is a nice, fairly quiet and stable current which is supplying a Vero. Here I am browsing the Kodi menus and alternating between playing and pausing content. This means that I am causing the Vero to cycle between several power management states and it is holding pretty steady.

![Stable power supply scope](http://progress.getvero.tv/assets/smooth_ripple.png "Stable power supply scope")

While I was at it, I thought about saving power when Vero is not in use. Vero has no 'off' button or switch, but it is imperative that we do not waste energy. Not having an off switch does not impair our ability to save power. I have implemented a low power mode where the CPU ends up in the lowest state possible and we poll the IR receiver for key presses to wake the device. This very slow standby mode consumes about half a Watt. That also means that Vero stays cool and prolongs its life. I'm very happy that Vero when at full load consumes less power than the Raspberry Pi (even the B+). 

Our power supplies are manufactured by Stontronics. They also manufacture the official Raspberry Pi charger and are a UK based company. Their power supplies are an excellent quality and will allow Vero to work comfortably and get the stable power supply it needs.

## Hardware coming off the line

So far, I've seen a 1% defect on average across all of our peripherals coming off the line. This is expected and within an acceptable range. The first batches of remotes, the Vero device itself and associated peripherals are all finished and we have enough stock to fulfil every order to date.

## So why haven't I shipped yet?

Good question. It turns out retail packaging has actually been the tricky part of things here. This was our planned retail packaging:

![OSMC Box](http://progress.getvero.tv/assets/box1.JPG "OSMC Box")
![OSMC Box](http://progress.getvero.tv/assets/box2.JPG "OSMC Box")

Unfortunately, Chinese New Year is fast approaching and we would not have been able to do even a fifth of our orders if I had waited, so I will likely ship in some plainer boxes for this initial run. I figure it's more important everyone gets their hand on a device first rather than wait for the box. I know some of you are itching to try Vero!

I did plan packaging way in advance of Chinese New Year. Our manufacturer repeatedly sent me new templates as they realised I needed to change dimensions and only right at the end told me they would not be able to fulfill the full order in time. 

## So what am I doing in the mean time?

I am now sourcing alternative packaging, but I have also spent some more time on the software. A lot of people have been asking about whether Vero can run Netflix. I have been experimenting with it. Netflix does indeed run on Vero. 

At the moment, a keyboard is needed. I am doing my best to get the remote fully integrated in time for shipping. Vero will be frequently updated with new features, so it's no big deal if it misses the ship date.

Vero can run Android as well. As a result, you will be able to run Android applications (apps and games. These will be selectable from within the OSMC / Kodi interface.

## Wrap up

Please make sure your shipping information is up to date. You can do this by clicking [here] (https://osmc.tv/shop/my-account). Some of you have asked
why the Vero is showing as 129.99 when you paid $199.99. That is a bug in our ordering system (it is displaying the former price in pounds) and you will receive a proper invoice as I ship.

Best wishes, and if you have any questions, please email sam@osmc.tv

Not long now

S
