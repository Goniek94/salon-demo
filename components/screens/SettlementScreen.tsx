"use client";

import {
  ArrowLeft,
  ArrowRightLeft,
  Banknote,
  Building2,
  ChartColumn,
  CircleCheckBig,
  CreditCard,
  Cpu,
  Download,
  Info,
  PackageCheck,
  Receipt,
  Stethoscope,
} from "lucide-react";

import type { ScenarioFacts, ScreenId } from "../../lib/simulation";

interface SettlementScreenProps {
  facts: ScenarioFacts;
  onAdvance: () => void;
  onNavigate: (screen: ScreenId) => void;
}

const history = [
  { id: "h1", date: "6 maja 2026", label: "Zakup pakietu Icoone 6 wejść", method: "Przelew · Firma A", amount: "3 660 zł" },
  { id: "h2", date: "5 czerwca 2026", label: "Wykorzystanie 2 z 6", method: "Pakiet · Firma A", amount: "0 zł" },
  { id: "h3", date: "3 lipca 2026", label: "Wykorzystanie 3 z 6", method: "Pakiet · Firma A", amount: "0 zł" },
];

export function SettlementScreen({ facts, onAdvance, onNavigate }: SettlementScreenProps) {
  return (
    <div className="screen-content">
      <button type="button" className="back-link" onClick={() => onNavigate("calendar")}>
        <ArrowLeft aria-hidden="true" /> Wróć do kalendarza
      </button>

      <section className="panel settlement-client">
        <div className="large-avatar">AK</div>
        <div>
          <strong>Anna Kowalska</strong>
          <span>Wizyta 19 sierpnia 2026, 15:30–17:00 · Marta Nowak · Gabinet 3</span>
        </div>
        <div>
          <span>Status wizyty</span>
          <strong>
            <CircleCheckBig aria-hidden="true" /> Zakończona
          </strong>
          <small>zakres zapisany przez kosmetologa</small>
        </div>
        <div>
          <span>Wartość wizyty</span>
          <strong>885 zł</strong>
          <small>po korekcie zakresu Emtone</small>
        </div>
        <div>
          <span>Do zapłaty dziś</span>
          <strong>{facts.settled ? "0 zł" : "275 zł"}</strong>
          <small>{facts.settled ? "opłacone kartą" : "reszta pokryta pakietem"}</small>
        </div>
        <div>
          <span>Firmy</span>
          <strong>
            <Building2 aria-hidden="true" /> A + B
          </strong>
          <small>rozdzielenie na poziomie zabiegu</small>
        </div>
      </section>

      <div className="settlement-grid">
        <div className="settlement-left">
          <section className="panel services-table">
            <div className="panel-heading">
              <div>
                <h3>Zabiegi w tej wizycie</h3>
                <p>Rozliczane jest to, co faktycznie wykonano — nie to, co było zaplanowane.</p>
              </div>
              <span className="ui-badge ui-badge-violet">2 z 3 pozycji wykonane</span>
            </div>

            <div className="services-header">
              <div>Zabieg</div>
              <div>Ilość</div>
              <div>Wartość</div>
              <div>Sposób zapłaty</div>
              <div>Firma</div>
              <div>Status</div>
            </div>

            <div className="service-row">
              <div className="service-name">
                <span className="service-circle service-violet">
                  <Stethoscope aria-hidden="true" />
                </span>
                <div>
                  <strong>Icoone Laser 8F</strong>
                  <small>udo i pośladki · 50 min</small>
                </div>
              </div>
              <strong>1</strong>
              <div>
                <strong>610 zł</strong>
                <small>cena katalogowa</small>
              </div>
              <div>
                <span className="ui-badge ui-badge-violet">
                  <PackageCheck aria-hidden="true" /> pakiet 4 z 6
                </span>
                <small>bez płatności przy kasie</small>
              </div>
              <div>
                <Building2 aria-hidden="true" />
                <div>
                  <strong>Firma A</strong>
                </div>
              </div>
              <div>
                <span className="ui-badge ui-badge-green">wykonane</span>
              </div>
            </div>

            <div className="service-row">
              <div className="service-name">
                <span className="service-circle service-blue">
                  <Cpu aria-hidden="true" />
                </span>
                <div>
                  <strong>Emtone — partia 1 (uda)</strong>
                  <small>40 min · skrócony zakres</small>
                </div>
              </div>
              <strong>1</strong>
              <div>
                <strong>275 zł</strong>
                <small>połowa ceny pakietu partii</small>
              </div>
              <div>
                <span className="ui-badge ui-badge-blue">
                  <CreditCard aria-hidden="true" /> karta
                </span>
                <small>terminal przy recepcji</small>
              </div>
              <div>
                <Building2 aria-hidden="true" />
                <div>
                  <strong>Firma B</strong>
                </div>
              </div>
              <div>
                <span className={facts.settled ? "ui-badge ui-badge-green" : "ui-badge ui-badge-orange"}>
                  {facts.settled ? "opłacone" : "do zapłaty"}
                </span>
              </div>
            </div>

            <div className="service-row">
              <div className="service-name">
                <span className="service-circle service-orange">
                  <Cpu aria-hidden="true" />
                </span>
                <div>
                  <strong>Emtone — partia 2 (brzuch)</strong>
                  <small>pominięte: świeża opalenizna</small>
                </div>
              </div>
              <strong>0</strong>
              <div>
                <strong>0 zł</strong>
                <small>nie obciąża klientki</small>
              </div>
              <div>
                <span className="ui-badge ui-badge-neutral">brak</span>
                <small>wraca do planu terapii</small>
              </div>
              <div>
                <Building2 aria-hidden="true" />
                <div>
                  <strong>Firma B</strong>
                </div>
              </div>
              <div>
                <span className="ui-badge ui-badge-neutral">niewykonane</span>
              </div>
            </div>

            <div className="service-total">
              <span>Wartość zabiegów: 885 zł</span>
              <span>Pokryte pakietem: 610 zł</span>
              <strong>Do zapłaty: {facts.settled ? "0 zł" : "275 zł"}</strong>
            </div>
          </section>

          <div className="settlement-lower">
            <section className="panel payment-history">
              <div className="panel-heading">
                <div>
                  <h3>Historia płatności klientki</h3>
                  <p>Wpłata i rozliczenie zabiegu to dwa różne zdarzenia.</p>
                </div>
                <Receipt aria-hidden="true" />
              </div>
              {history.map((item) => (
                <div key={item.id}>
                  <span>{item.date}</span>
                  <span>{item.label}</span>
                  <span>{item.method}</span>
                  <strong>{item.amount}</strong>
                </div>
              ))}
              {facts.settled ? (
                <div>
                  <span>19 sierpnia 2026</span>
                  <span>Emtone — partia 1</span>
                  <span>Karta · Firma B</span>
                  <strong>275 zł</strong>
                </div>
              ) : null}
              <button type="button">
                <Download aria-hidden="true" /> Pobierz zestawienie
              </button>
            </section>

            <section className="panel daily-report">
              <div className="panel-heading">
                <div>
                  <h3>Raport dnia</h3>
                </div>
                <small>19 sierpnia</small>
              </div>
              <div>
                <span>Gotówka</span>
                <strong>1 240 zł</strong>
              </div>
              <div>
                <span>Karta</span>
                <strong>{facts.settled ? "4 815 zł" : "4 540 zł"}</strong>
              </div>
              <div>
                <span>Wejścia z pakietów</span>
                <strong>{facts.settled ? "7" : "6"}</strong>
              </div>
              <div>
                <span>Firma A / Firma B</span>
                <strong>{facts.settled ? "3 190 / 2 865 zł" : "3 190 / 2 590 zł"}</strong>
              </div>
            </section>
          </div>
        </div>

        <section className="panel settlement-summary">
          <h3>Podsumowanie wizyty</h3>
          <div className="summary-values">
            <div>
              <span>Wartość zabiegów</span>
              <strong>885 zł</strong>
            </div>
            <div>
              <span>Pokryte pakietem</span>
              <strong>610 zł</strong>
            </div>
            <div>
              <span>Do zapłaty</span>
              <strong>{facts.settled ? "0 zł" : "275 zł"}</strong>
            </div>
          </div>

          <h3>Źródła płatności</h3>
          <div className="method-list">
            <div>
              <span>
                Pakiet Icoone
                <small>1 wejście · Firma A</small>
              </span>
              <strong>610 zł</strong>
            </div>
            <div>
              <span>
                Karta
                <small>terminal · Firma B</small>
              </span>
              <strong>275 zł</strong>
            </div>
          </div>

          <div className="company-flow">
            <div>
              <strong>Firma A</strong>
              <span>Icoone Laser 8F</span>
            </div>
            <ArrowRightLeft aria-hidden="true" />
            <div>
              <strong>Firma B</strong>
              <span>Emtone partia 1</span>
            </div>
          </div>

          {facts.settled ? (
            <div className="settlement-done">
              <CircleCheckBig aria-hidden="true" />
              <strong>Rozliczenie zamknięte</strong>
              <span>Dwa dokumenty sprzedaży, jedna wizyta i jeden komplet danych klientki.</span>
              <button type="button" className="secondary-button" onClick={() => onNavigate("client")}>
                <ChartColumn aria-hidden="true" /> Zobacz skutki w karcie klientki
              </button>
            </div>
          ) : (
            <button type="button" className="primary-button" onClick={onAdvance}>
              <Banknote aria-hidden="true" /> Zamknij rozliczenie
            </button>
          )}

          <div className="principle-note">
            <Info aria-hidden="true" />
            <div>
              <strong>Salon nie jest firmą rozliczeniową</strong>
              <p>
                System pilnuje, do której firmy trafia dany zabieg, ale nie zastępuje księgowości. Eksport
                trafia do systemu finansowego.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
