<h1 align="center">SatAllowance</h1>
<p align="center" style="font-style: italic;">
    Give your kids Bitcoin; Stack Sats on <a href="https://satscard.com/">SATSCARDs</a> 🚀
</p>
<p align="center">
    <a href="#-demo">Demo</a> |  <a href="#-requirements">Requirements</a> | <a href="#-getting-started">Getting Started</a> | <a href="#-resources">Resources</a> | <a href="#-contributing">Contributing</a>
</p>
<div align="center">

![](https://img.shields.io/github/license/joshuaporth/satallowance.svg)
![](https://img.shields.io/github/issues/joshuaporth/satallowance.svg)
![](https://img.shields.io/github/issues-pr/joshuaporth/satallowance.svg)

</div>

## 🎉 Demo
TODO

## 🤓 Requirements
SatAllowance reqiuires a __Smart Card Reader__ and at least 1 __SATSCARD__.

### Smart Card Reader
Below is a quote from the `coinkite-tap-protocol` [README](https://github.com/coinkite/coinkite-tap-proto?tab=readme-ov-file#requirements). I hight recomend the __HID Omnikey 5022 CL__ which is available from [Coinkite](https://store.coinkite.com/store/nfc-read-b).
```
A supported smart card reader. In theory, all smart card USB CCID class-compliant devices should work. Our observations:

    ACS ACR1252U - okay and widely available, and for sale by Coinkite
    Identiv uTrust 3700F - reliable and looks nice
    HID Omnikey 5022 CL (not 5021) - fast, cute, and small
    HID OmniKey 5427 CK - tested Gen1 device, fast, reliable, must disable keyboard wedge via EEM interface on device at http://192.168.63.99/, when correct will identify as VID:PID 076b:5427
    NOT recommended: ACS ACR122U. It can work, and is widely available, but is not reliable.
```

### SATSCARDs
The __SatAllowance__ UX is centered around Coinkite [SATSCARDs](https://satscard.com/). Each kid should have 1 (or more?) SATSCARDs. See the list below for a few of my kids favorite SATSCARD designs 😄. The great _BTC Sessions_ created a [SATSCARD Tutorial](https://www.youtube.com/watch?v=5dc3RSZKGto) using Nunchuk. Coinkite also has a very comprehensive [FAQ](https://satscard.com/faq) that should answer any question you might have.

#### Favorite SATSCARD Designs
- [SATSCARD™ Sparrow](https://store.coinkite.com/store/sc-sparrow)
- [SATSCARD™ Cyber Hornet](https://store.coinkite.com/store/sc-hornet)
- [SATSCARD™ Lil HODLer NGU](https://store.coinkite.com/store/sc-lhodl)



## 🧑‍💻 Getting Started
### Installation
__SatAllowance__ is "installed" by running the following commands in your terminal. <ins>The installion has only been tested on a Debian-based Linux OS.</ins>
```sh
git clone git@github.com:joshuaporth/satallowance.git
cd satallowance
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
```

### Usage
```sh
# Start SatAllowance and open the web app
bin/satallowance start

# Check if SatAllowance is running
bin/satallowance status

# Stop SatAllowance
bin/satallowance stop
```

## 📚 Resources
Bitcoin things my kids like...  
### Tuttle Twins
> In a show that teaches important lessons through zany adventures and clever stories, Ethan and Emily Tuttle are a pair of inquisitive and daring twins on a quest to learn and grow. When the twins’ Grandma Gabby moves in with their family, she begins to teach them all about liberty, freedom, and economics— with the help of her pet raccoon, Derek, and her time-traveling wheelchair. Traverse through space and time with the Tuttle Twins and learn to be a better citizen while you’re at it.  

__Tuttle Twins__ episodes are available for streaming from [Angel Sudios](https://www.angel.com/watch/tuttle-twins) free of charge. Additional episodes are available to "Guild Members" which requires a monthly fee.

Unfortunately, Angel Studios does not _YET_ accept Bitcoin in exchange for Guild Membership 🧐

 #### Free Episodes
- [S1E6 - The Inflation Monster](https://www.angel.com/watch/tuttle-twins/episode/5daf8a13-4532-4fbf-a89f-e37d544c0ec0/season-1/episode-6/the-inflation-monster)
- [S2E3 - Bitcoin and the Beast](https://www.angel.com/watch/tuttle-twins/episode/de46fca9-d387-47f5-b13f-ff336885518c/season-2/episode-3/bitcoin-and-the-beast)

## 🧡 Contributing
Contributions to __SatAllowance__ are welcome! Feel free to create issues or submit pull requests. Here is a short list of potential improvements and research task:  
- Show STATSCARD balance on Address QR page
- Add an option for self-hosted mempool monitoring
- Research using WebUSB or WebHID in place of the Tap Server and `coinkite-tap-protocol`
- Add more Emoji Sets and add QSP to select a random Emoji Set from a list
- Add support for Mac, Windows, and other flavors of Linux

<br>
<p align="center" style="font-weight: lighter;">
    Stay Humble and Stack Sats.
</p>