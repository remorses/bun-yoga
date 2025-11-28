## goal

create a NAPI module for yoga. that will be used from Bun. 

using same exact layout as yoga-layout

see node_modules/yoga-layout/dist/src/index.d.ts for the shape of yoga-layout API

## how to read github repos files

`curl gitchamber.com` to see how to list, read github files and also search in them and paginate files

## tools to use

zig. the one already installed which is 0.15
https://github.com/cztomsik/napigen for generating the napi bindgen. read the api and examples
NAPI for connecting our zig code to bun
bun to test the generated NAPI module
for the yoga access in Bun: https://github.com/cmsommer/yoga-zig or https://github.com/Sobeston/yoga.zig (a bit older)


read all necessary information of these modules


## plan part 1

- create simple zig basic structure, for a library. mimic what napigen examples did
- research what data types napigen has and what kind of functions you can create.
- think if we need to update a bit the yoga-layout API for our use case to simplify our jobs
- install yoga in build.zig. try both if first does not work
- try creating a simple test from zig to see if yoga works there
- try exposing a super basic function or class to see if NAPI works
- try to acccess it in a Bun script. write a bun test to make sure it works as expected


## plan part 2

- start implementing the full yoga-layout API in zig. so that the NAPI module will look the same in Bun and js part. if required, you can also add some .js glue code. if necessary you can update the API to make this easier. not strictly same as yoga-layout
- the feedback loo will be
  - update zig code
  - zig build
  - zig test
  - bun test

## progress

keep a progress.md file with the current progress and decisions made in the project so you can read it again after compaction. keep important todos there too. with the APIs implemented and to implement

every new message check if this file already exists in case you have been revived after compaction
