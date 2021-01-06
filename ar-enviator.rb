#!/usr/bin/env ruby
# 
# AR Enviator!!1 ~ Enviador de ARs
# Copyright (C) 2021  PUDIVA <rogi@skylittlesystem.org>
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
# 
require "open3"
require "byebug"

def paste s
  Open3.popen3("xclip -i -selection clipboard") do |stdin, stdout, stderr, wait|
    stdin.write(s)
    stdout.close
    stdin.flush
    stdin.close
    stderr.close
    wait.join
  end

  `xdotool key ctrl+a Delete ctrl+v`
  sleep 0.1
end

def tab
  `xdotool key Tab`
end

def find s
  `xdotool key ctrl+f`
  paste s
  `xdotool key Escape`
  sleep 0.1
end

txt = `xclip -o -selection clipboard`.strip
txt.gsub!(/^\s*$/, "")

txt =~ /n.mero do processo:\s*([0-9]*-[0-9]{2})/i
n_processo = $1.strip

#txt =~ /ju.z.*determina.*(cita..o|intima..o) de ([^-\n]+)(\n|-)(.+),([^-]+)-([^-]+)-\s*CEP:([ :0-9-]+)/i
#txt =~ /ju.z.*determina.*(cita..o|intima..o) de ([^\n]+)(\n|-|,)(.+),([^,-]+)-([^,-]+)-\s*CEP:([ :0-9-]+)/i
#txt =~ /ju.z.*determina.*(cita..o|intima..o) de ([^\n-]+)(\n|-|,)(.+),([^,-]+)-([^,-]+)-\s*CEP:([ :0-9-]+)/i
#txt =~ /ju.z.*determina.*(cita..o|intima..o) d. ([^\n-]+-?[^\n,-]*)(\n|-)(.+),([^,-]+)-([^,-]+)-\s*CEP:([ :0-9-]+)/i
txt =~ /ju.z.*determina.*(cita..o|intima..o) d. ([^\n-]+-?[^\n,-]*)(\n|-|,)(.+),([^,-]+)-([^,-]+)-\s*CEP:([ :0-9-]+)/i
nome = $2.strip
destinatario = "#{n_processo} #{nome}"

endereco = $4.strip
cidade = $5.strip
estado = $6.strip
cep = $7.strip

`xdotool search --name 'mensagens expressas' windowactivate --sync`
abort("janela nao encontrada") if $? != 0

find "Home"
find "Destinatário"
tab
paste destinatario
tab
paste endereco
tab
paste cidade
tab
sleep 0.1
`xdotool type "#{estado}"`
tab
paste cep

find "Remetente"
tab
paste "01- 0215 - 15ª Vara Cível de Brasília TJDFT"
tab
paste "FÓRUM DE BRASÍLIA – LOTE 1, BLOCO B, 1º SUBSOLO, ALA C, SALA 26"
tab
paste "Brasília"
tab
sleep 0.1
`xdotool type "DF"`
tab
paste "70094900"
tab
tab
paste "15vcivel.brasilia@tjdft.jus.br"
tab
sleep 0.1
`xdotool key space`


find "Texto da Carta Nacional"
tab
paste txt.gsub("\r\r", "\r")
