# Project Mirage
A collection of tools I used to track my happiness over time using SMS and Google Sheets for a full year

## Introduction

The landscape of studies on individual satisfaction or happiness is littered with examinations of broad-based surveys that attempt to examine the happiness level of a cohort of people with an objective scale of happiness. While those are fruitful in their own way, broad-based studies with supposedly objective scales do not offer any individual insight as to what factors influence happiness on the individual level.  My informal, year-long (and still going) study examines my personal positivity patterns through polled data points over a period of several months at an hourly resolution. This kind of a study not only offers insights about factors that influence individual optimism, but also show general trends that may help individuals identify common patterns in positivity and develop awareness of these trends early on.

This repository is a collection of tools I used internally to keep track of, collect, and visualize the data I gathered during the duration of this project, in the hopes that others, including my future self, may find it useful to answers questions like "What's the happiest day of the week for me?" or "During what hours of the day am I happiest?" or "Is my life really getting less enjoyable since I got this new job?"

## Usage

I divided the investigation into two separate parts: the data gathering and the analysis. Data gathering largely does not concern this codebase directly, but analysis and visualization does.

### Data gathering

For a number of reasons of personal preference, I chose to use the [IFTTT](ifttt.com) service to tie Google Sheets into an SMS number to gather my data. I created an IFTTT recipe that, when sent an SMS message tagged with a specific identifier (`#mirage` in my case), the integer value from that message (a number from scale 0-100) was sent to create a new row on a Google Sheets spreadsheet with the timestamp.

Personally, because I wanted data at the hourly level, I repeated the process 3-5 times during the day every day for around a year, and because of the ubiquity of the phone and the low-bandwidth nature of SMS, there were no problems in this step.

### Analysis and visualization

Analysis is done in a number of steps linking a few scripts together, and the `analyze.sh` shell script will automatically run the entire sequence for you, given that you have:

1. the sharing / download ID of your Google Sheets spreadsheet

2. a competent UNIX system or Windows 10 with `wget`, `node`, and `bash`/`zsh`

3. sharing permissions correctly configured on the spreadsheet (public link)

The bash script runs the following steps, in order

1. Download the CSV file of your dataset into `data.csv` into the root directory of the project

2. Extrapolate to the hourly resolution the downloaded dataset to generate a `complete.csv` by running the original CSV through `extrapolate.js`, a Node script

3. Set up the files necessary to view a visual representation of your data at `app.html`

4. Output any rows of the CSV that led to garbled numbers or incomprehensible data

