import { Lightbulb, BookOpen, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import { Section, Hook, Prose, KeyIdea, Code } from '../../components/learning/Section'
import { CommonMistake } from '../../components/learning/CommonMistake'
import { Quiz } from '../../components/learning/Quiz'

export default function WhatToTest() {
  const doTest = [
    'User-visible behavior (clicking, typing, what renders)',
    'Conditional logic and edge cases (empty, error, boundary values)',
    'Important business rules (a total computes correctly)',
    'Bugs you’ve fixed (a regression test so they don’t return)',
  ]
  const dontTest = [
    'Implementation details (internal state variable names, CSS classes)',
    'Third-party libraries (trust they’re tested)',
    'Trivial code with no logic (a component that just renders a prop)',
    'Exact markup via huge snapshots of whole pages',
  ]
  return (
    <>
      <Section icon={Lightbulb} title="Judgment, not just mechanics" step="Hook">
        <Hook>
          You can write tests. But <em>which</em> tests? Interviewers probe this:
          too few and you've proven nothing; too many of the wrong kind and you've
          built a brittle cage that fights every refactor.
        </Hook>
      </Section>

      <Section icon={BookOpen} title="A practical heuristic" step="Explanation">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
              <CheckCircle2 size={15} /> Worth testing
            </p>
            <ul className="space-y-1.5 text-sm text-content">
              {doTest.map((t) => <li key={t}>• {t}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-rose-300">
              <XCircle size={15} /> Usually not worth it
            </p>
            <ul className="space-y-1.5 text-sm text-content">
              {dontTest.map((t) => <li key={t}>• {t}</li>)}
            </ul>
          </div>
        </div>
        <KeyIdea title="Ask: would this test fail for a real bug?">
          If a test would only break when something genuinely wrong happens (not on
          a harmless refactor), it's pulling its weight. If it breaks on cosmetic
          changes, reconsider it.
        </KeyIdea>
        <CommonMistake title="Common mistake: chasing 100% coverage" to="/testing/rtl-philosophy" linkLabel="Revisit: behavior over implementation">
          100% line coverage doesn't mean "well tested" — you can cover every line
          while asserting nothing meaningful. Aim for confidence in behavior, not a
          coverage number.
        </CommonMistake>
      </Section>

      <Section icon={Sparkles} title="Quiz" step="Check yourself">
        <Quiz
          questions={[
            {
              id: 'q1',
              question: 'Which is the BEST thing to test?',
              options: [
                'The name of a useState variable',
                'That clicking “Add” adds an item to the visible list',
                'That React renders at all',
                'A third-party date library',
              ],
              answer: 1,
              explanation: 'User-visible behavior is the high-value target; the rest are implementation/trust details.',
            },
            {
              id: 'q2',
              question: 'Is 100% code coverage a guarantee of good tests?',
              options: ['Yes, always', 'No — you can cover lines while asserting nothing meaningful', 'Only with snapshots', 'Only for hooks'],
              answer: 1,
              explanation: 'Coverage measures execution, not assertion quality. Confidence in behavior matters more.',
            },
          ]}
        />
      </Section>
    </>
  )
}
