/*
 * AR Enviator!!1 ~ Enviador de ARs
 * Copyright (C) 2021  PUDIVA <rogi@skylittlesystem.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

function put(name, value)
{
  element = document.getElementsByName(name)[0];
  if (element)
    element.value = value
  return element;
}

function fill()
{
  textarea = document.getElementById("ar-enviator-textarea");
  txt = textarea.value;
  txt = txt.replace(/(\s*\n){3,}/g, "\n\n");
  txt = txt.trim();
  //txt = txt.replace("/\r?\n|\r/", "\n");
  x = {}

  m = txt.match(/n.mero do processo:\s*([0-9]*-[0-9]{2})/i);
  x["n_processo"] = m[1].trim();

  m = txt.match(/ju.z.*determina.*(cita..o|intima..o) d. ([^\n-]+-?[^\n,-]*)(\n|-|,)(.+),([^,-]+)-([^,-]+)-\s*CEP:([ :0-9-]+)/i);
  x["tipo"] = m[1].trim();
  x["nome"] = m[2].trim();
  x["endereco"] = m[4].trim();
  x["cidade"] = m[5].trim();
  x["estado"] = m[6].trim();
  x["cep"] = m[7].trim();

  /* destinatário */
  put("NOME_DEST", `${x.n_processo} ${x.nome}`);
  put("ENDER_DEST", x.endereco);
  put("CID_DEST", x.cidade);

  /* FIXME */
  put("UF_DEST", x.estado);
  put("CEP_DEST", x.cep);
  put("CXPOSTAL_DEST", "");

  /* remetente */
  put("NOME_REM", "01- 0215 - 15ª Vara Cível de Brasília TJDFT");
  put("ENDER_REM", "FÓRUM DE BRASÍLIA – LOTE 1, BLOCO B, 1º SUBSOLO, ALA C, SALA 26");
  put("CID_REM", "Brasília");

  /* FIXME */
  put("UF_REM", "DF");
  put("CEP_REM", "70094-900");
  put("EMAIL_REM", "15vcivel.brasilia@tjdft.jus.br");

  /* serviços adicionais */
  aviso_recebimento = document.getElementsByName("CARTA_AR")[0];
  aviso_recebimento.checked = true;

  /* texto da carta nacional */
  put("CARTA", txt);
}

function clear()
{
  textarea = document.getElementById("ar-enviator-textarea");
  textarea.value = "";
}

function setup_panel()
{
  heading = document.querySelector("#areaConteudo > blockquote > h1");
  if (!heading || heading.textContent.trim() != "Carta Nacional")
    return;

  old_div = document.getElementById("ar-enviator-div");
  if (old_div)
    old_div.parentNode.removeChild(old_div);

  old_style = document.getElementById("ar-enviator-style");
  if (old_style)
    old_style.parentNode.removeChild(old_style);

  style_html = `
    <style id="ar-enviator-style">
      #ar-enviator-div {
        padding: 1em;
        border: 3px dashed magenta;
        font-size: 12pt;
        text-align: left;
      }

      #ar-enviator-div h1 {
        font-size: 150%;
        color: blue;
        text-decoration: underline;
        text-shadow: 0px 0px 32px yellow;
        text-align: center;
      }

      #ar-enviator-div marquee, #ar-enviator-pudiva, #ar-enviator-div h1 {
        font-family: "Comic Sans MS", "Comic Sans", cursive, sans;
        font-weight: bold;
      }

      #ar-enviator-div marquee {
        font-size: 24pt;
        color: cyan;
        text-shadow: 1px 1px 3px black;
      }

      #ar-enviator-div marquee img {
        vertical-align: middle;
      }

      #ar-enviator-div hr {
        border: 0px;
        border-top: 3px dashed magenta;
      }

      #ar-enviator-pudiva {
        color: magenta;
        text-shadow: 1px 1px 1px cyan;
      }

      #ar-enviator-textarea {
        width: 100%;
        height: 10em;
      }
    </style>
  `

  range = document.createRange();
  frag = range.createContextualFragment(style_html);
  document.head.appendChild(frag);

  mailto = "rogi@skylittlesystem.org"
  website = "https://ar-enviator.skylittlesystem.org"

  panel_html = `
    <div id="ar-enviator-div">
      <marquee>
        <img src="${browser.extension.getURL("favicon.gif")}">
        AR Enviator!!1
        <img src="${browser.extension.getURL("favicon.gif")}">
      </marquee>

      <hr>

      <h1>Leia com atenção!</h1>

      <p><strong>AR Enviator!!1</strong> Copyright &copy; 2021
      <span id="ar-enviator-pudiva">PUDIVA</span> &lt;<a href="mailto:${mailto}">${mailto}</a>&gt;</p>

      <p>Este programa não tem qualquer relação com o Tribunal de Justiça ou
      qualquer outro orgão do governo e vem com <strong>ABSOLUTAMENTE NENHUMA
      GARANTIA</strong>; Este é um software livre, e você pode redistribuí-lo
      sob certas condições; visite o <a href="${website}">site oficial</a> para
      mais informações.</a></p>

      <p>Para usar, clique no texto do AR no PJE, selecione tudo
      (<code>CTRL+A</code>), copie (<code>CTRL+C</code>), cole no campo abaixo
      (<code>CTRL+V</code>) e clique preencher!</p>

      <p><strong>Antes de enviar, verifique se os campos foram preenchidos
      corretamente!</strong> Dependendo da formatação do AR, alguns dados podem
      ser preenchidos incorretamente.</p>

      <label for="ar-enviator-textarea">Texto do AR:</label>
      <textarea placeholder="Copie o texto do AR aqui!"
      id="ar-enviator-textarea"></textarea>

      <br>

      <button id="ar-enviator-fill">Preencher!!1</button>
      <button id="ar-enviator-clear">Limpar</button>
    </div>
  `

  range = document.createRange();
  frag = range.createContextualFragment(panel_html);
  heading.parentNode.insertBefore(frag, heading);

  clear_button = document.getElementById("ar-enviator-clear");
  clear_button.onclick = clear;

  fill_button = document.getElementById("ar-enviator-fill");
  fill_button.onclick = fill;
}

setup_panel();
