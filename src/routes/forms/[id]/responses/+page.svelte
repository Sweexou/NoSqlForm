<script lang="ts">
  import { goto } from '$app/navigation';
  
  export let data;
  const { form, responses } = data;
</script>

<svelte:head>
  <title>Responses - {form.title}</title>
</svelte:head>

<div class="responses-container">
  <header class="responses-header">
    <button on:click={() => goto('/forms-home')} class="back-btn">← Back to Forms</button>
    <h1>Responses for "{form.title}"</h1>
    <p class="responses-count">{responses.length} response(s)</p>
  </header>

  <div class="responses-content">
    {#each responses as response, idx}
      <div class="response-card">
        <h3>Response #{idx + 1}</h3>
        <p class="response-date">Submitted: {new Date(response.submittedAt).toLocaleString()}</p>
        
        {#each form.questions as question}
          <div class="question-response">
            <h4>{question.label}</h4>
            <div class="answer">
              {#if question.type === 'multiple'}
                {#if response.answers[question.questionId]?.length > 0}
                  <ul>
                    {#each response.answers[question.questionId] as answer}
                      <li>{answer}</li>
                    {/each}
                  </ul>
                {:else}
                  <em>No answer provided</em>
                {/if}
              {:else}
                <p>{response.answers[question.questionId] || '<em>No answer provided</em>'}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-responses">
        <p>No responses yet for this form.</p>
        <a href="/form/{form._id}" target="_blank">Share this form to collect responses</a>
      </div>
    {/each}
  </div>
</div>

<style>
  .responses-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }

  .responses-header {
    margin-bottom: 2rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }

  .back-btn {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .back-btn:hover {
    background: #5a6268;
  }

  .response-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .question-response {
    margin: 1rem 0;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .question-response h4 {
    margin: 0 0 0.5rem 0;
    color: #495057;
  }

  .answer {
    margin: 0.5rem 0;
  }

  .no-responses {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }

  .no-responses a {
    color: #007bff;
    text-decoration: underline;
  }
</style>
