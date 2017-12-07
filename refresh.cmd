d:

set root=d:\rw\pavelpz\reactx-html

cd %root%
rmdir node_modules /s /q
cd %root%\jspm_packages
rmdir npm /s /q

cd %root%
call npm install
call jspm install

rmdir %root%\node_modules\@types\node /s /q